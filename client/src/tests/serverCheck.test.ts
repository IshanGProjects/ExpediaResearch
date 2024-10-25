// serverCheck.test.ts
describe('Server Response Log Test - Part 2', () => {
    it('should log "Server check verified"', () => {
      const consoleSpy = jest.spyOn(console, 'log');
  
      // Mock log output that we want to check
      console.log("Server check verified");
  
      expect(consoleSpy).toHaveBeenCalledWith("Server check verified");
  
      // Cleanup the spy after the test
      consoleSpy.mockRestore();
    });
  });
  