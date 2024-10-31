import NextTopLoader from "nextjs-toploader";
import React from "react";

export default function TopLoader() {
  return (
    <div>
      <NextTopLoader
        color="#000000"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        easing="ease"
        showSpinner={false}
      />
    </div>
  );
}
