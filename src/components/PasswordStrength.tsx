import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";

// todo: add if necessary
export function PasswordStrength({ password }: { password: string }) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setScore(result.score);
      setFeedback(
        result.feedback.warning || result.feedback.suggestions[0] || "",
      );
    } else {
      setScore(0);
      setFeedback("");
    }
  }, [password]);

  const strengthClasses = {
    0: "bg-red-500",
    1: "bg-orange-500",
    2: "bg-yellow-500",
    3: "bg-blue-500",
    4: "bg-green-500",
  };

  const strengthLabels = {
    0: "Very Weak",
    1: "Weak",
    2: "Fair",
    3: "Strong",
    4: "Very Strong",
  };

  return (
    <div className="space-y-2">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 transition-all duration-300 ${
              i <= score
                ? strengthClasses[score as keyof typeof strengthClasses]
                : ""
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">
          {score > 0 && strengthLabels[score as keyof typeof strengthLabels]}
        </span>
        {feedback && <span className="text-muted-foreground">{feedback}</span>}
      </div>
    </div>
  );
}
