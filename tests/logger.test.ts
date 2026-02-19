import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logSuccess, logError, logInfo } from "../src/logger.js";

describe("logger", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe("logSuccess", () => {
    it("should log to stdout", () => {
      logSuccess("done");
      expect(logSpy).toHaveBeenCalledOnce();
    });

    it("should include the message text", () => {
      logSuccess("operation complete");
      const output = logSpy.mock.calls[0][0] as string;
      expect(output).toContain("operation complete");
    });
  });

  describe("logError", () => {
    it("should log to stderr", () => {
      logError("failed");
      expect(errorSpy).toHaveBeenCalledOnce();
    });

    it("should include the error message text", () => {
      logError("something broke");
      const output = errorSpy.mock.calls[0][0] as string;
      expect(output).toContain("something broke");
    });
  });

  describe("logInfo", () => {
    it("should log to stdout", () => {
      logInfo("info message");
      expect(logSpy).toHaveBeenCalledOnce();
    });

    it("should include the info message text", () => {
      logInfo("details here");
      const output = logSpy.mock.calls[0][0] as string;
      expect(output).toContain("details here");
    });
  });
});
