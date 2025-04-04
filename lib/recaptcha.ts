export async function verifyCaptcha(token: string): Promise<{
  success: boolean;
  message: string;
  score?: number;
  action?: string;
}> {
  // Skip in development
  if (process.env.NODE_ENV !== "production") {
    return {
      success: true,
      message: "Development mode - skipped",
      score: 0.9,
      action: "development",
    };
  }

  if (!token) {
    return {
      success: false,
      message: "Missing token",
    };
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      throw new Error("RECAPTCHA_SECRET_KEY is not set");
    }

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();

    return {
      success: data.success === true,
      message: data["error-codes"]?.join(", ") || "Verified",
      score: data.score,
      action: data.action,
    };
  } catch (error) {
    console.error("CAPTCHA Verification Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Verification failed",
    };
  }
}
