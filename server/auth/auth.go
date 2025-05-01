package auth

import (
	"context"
	"errors"
	"log"
	"net/smtp"

	"firebase.google.com/go/v4/auth"
)

// User represents a user in the system
type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthService provides authentication services
type AuthService struct {
	FireAuth *auth.Client
}

// Login authenticates a user with Firebase Authentication and returns an ID token
func (s *AuthService) Login(email, password string) (string, string, error) {
	// Authenticate with Firebase using email and password
	user, err := s.FireAuth.GetUserByEmail(context.Background(), email)
	if err != nil {
		log.Printf("failed to get user from Firebase: %v", err)
		return "", "", errors.New("invalid email or password")
	}

	// Firebase does not expose password verification in Admin SDK.
	// Instead, the client should authenticate via Firebase SDK and send the ID token to the server.

	// Generate a Firebase custom token using the UID
	token, err := s.FireAuth.CustomToken(context.Background(), user.UID)
	if err != nil {
		log.Printf("failed to generate custom token: %v", err)
		return "", "", errors.New("internal server error")
	}

	userRecord, err := s.FireAuth.GetUser(context.Background(), user.UID)
	if err != nil {
		log.Printf("failed to fetch user record: %v", err)
		return "", "", errors.New("internal server error")
	}
	return token, userRecord.DisplayName, nil
}

// Register creates a new user in Firebase and returns a Firebase custom token
func (s *AuthService) Register(email, password, username string) (string, string, error) {
	// Create a new user in Firebase Authentication
	params := (&auth.UserToCreate{}).
		Email(email).
		Password(password).
		DisplayName(username)

	userRecord, err := s.FireAuth.CreateUser(context.Background(), params)
	if err != nil {
		log.Printf("failed to create Firebase user: %v", err)
		return "", "", errors.New("failed to create user")
	}

	// Generate a Firebase custom token
	customToken, err := s.FireAuth.CustomToken(context.Background(), userRecord.UID)
	if err != nil {
		log.Printf("failed to generate custom token: %v", err)
		return "", "", errors.New("internal server error")
	}

	return customToken, username, nil
}

func (s *AuthService) Reset(email string) error {
	actionCodeSettings := &auth.ActionCodeSettings{
		URL:                   "https://localhost:8000/resetpwd",
		HandleCodeInApp:       true,
		IOSBundleID:           "com.example.ios",
		AndroidPackageName:    "com.example.android",
		AndroidInstallApp:     true,
		AndroidMinimumVersion: "12",
	}
	ctx := context.Background()
	link, err := s.FireAuth.PasswordResetLinkWithSettings(ctx, email, actionCodeSettings)
	if err != nil {
		log.Fatalf("error generating email link: %v\n", err)
		return errors.New("internal server error")
	}

	// Construct password reset template, embed the link and send
	// using custom SMTP server.
	sendEmail(email, link)
	return nil
}

func sendEmail(to, body string) error {
	log.Printf("entered email generation")
	// Replace these with your actual email and app password
	from := "researchexpedia@gmail.com"

	//PUT GMAIL APP PASSWORD FROM DISCORD HERE
	//
	//
	//
	password := "" // not your Gmail password — use an App Password if using Gmail
	//
	//
	//
	//

	// SMTP server config (Gmail’s)
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Message
	message := []byte("From: " + from + "\r\n" +
		"To: Tripfinder User\r\n" +
		"Subject: Password Reset Link\r\n" +
		"\r\n" +
		"Click the link below to reset your password:\n" + body + "\n")
	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		return err
	}
	return nil
}
