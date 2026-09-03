import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Keith Vergara | Full-Stack Web Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#f0f0f0",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid #262626",
            borderRadius: 16,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#10b981",
              }}
            />
            <span
              style={{
                fontSize: 20,
                color: "#10b981",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Open to Work
            </span>
          </div>
          <span
            style={{
              fontSize: 20,
              color: "#737373",
              fontFamily: "monospace",
            }}
          >
            keithvergara.dev
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h1
            style={{
              fontSize: 68,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Keith Vergara
          </h1>
          <p
            style={{
              fontSize: 32,
              fontWeight: 500,
              margin: 0,
              color: "#a3a3a3",
            }}
          >
            Full-Stack Web Developer
          </p>
          <p
            style={{
              fontSize: 22,
              color: "#737373",
              margin: 0,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Building real-time device monitoring platforms, POS systems, and AI-powered web applications.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {["Next.js", "React", "TypeScript", "PHP", "MySQL", "Supabase", "Tailwind CSS"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 18px",
                  borderRadius: 9999,
                  backgroundColor: "#171717",
                  border: "1px solid #333333",
                  fontSize: 18,
                  color: "#d4d4d4",
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
