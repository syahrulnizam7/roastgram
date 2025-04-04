export async function verifyCaptcha(token: string): Promise<{
  success: boolean;
  message?: string;
  score?: number;
}> {
  // Skip verification in development
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode - skipping captcha verification");
    return { success: true, score: 0.9 };
  }

  if (!token) {
    return { success: false, message: "Missing captcha token" };
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      throw new Error("RECAPTCHA_SECRET_KEY is not configured");
    }

    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";

    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data);
      return {
        success: false,
        message: data["error-codes"]?.join(", ") || "Verification failed",
        score: data.score,
      };
    }

    return {
      success: true,
      score: data.score,
      message: "Verification successful",
    };
  } catch (error) {
    console.error("Error verifying captcha:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Verification error",
    };
  }
}
