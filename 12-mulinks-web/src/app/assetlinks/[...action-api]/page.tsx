"use client";

import ActionContainer from "@/components/action-container";

const ActionPage = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-2 py-4 md:px-8 dark:bg-black">
      <div className="w-full max-w-xl">
        <ActionContainer />
      </div>
    </main>
  );
};

export default ActionPage;
