// REQUIRED TO IMPORT SVG FILES IN REACT COMPONENTS 
// (THE LOGO FOR EXPEDIA)
declare module "*.svg" {
    const content: string;
    export default content;
  }

// REQUIRED TO IMPORT JPG FILES IN REACT COMPONENTS
// (THE IMAGE ON HOME PAGE)
declare module "*.jpg" {
  const value: string;
  export default value;
}
  

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}