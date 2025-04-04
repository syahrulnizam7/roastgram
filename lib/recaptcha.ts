// In your lib/recaptcha.ts file
export async function verifyCaptcha(token: string, scoreThreshold = 0.5) {
  try {
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: "POST",
      }
    );

    const data = await recaptchaResponse.json();

    // Check both success and score threshold
    if (data.success && data.score >= scoreThreshold) {
      return {
        success: true,
        message: "Verification successful",
        score: data.score,
      };
    } else {
      return {
        success: false,
        message: data.success
          ? `Score too low: ${data.score}`
          : data["error-codes"]?.join(", ") || "Unknown error",
        score: data.score || 0,
      };
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error during verification",
      score: 0,
    };
  }
}
