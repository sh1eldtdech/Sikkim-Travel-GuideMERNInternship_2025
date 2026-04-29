import React from "react";

const PageContainer = ({ children, size = "wide", bottom = "normal" }) => {
  const sizeClass =
    size === "narrow"
      ? "page-container__inner--narrow"
      : size === "full"
        ? "page-container__inner--full"
        : "page-container__inner--wide";

  const bottomClass =
    bottom === "compact" ? "pb-12" : bottom === "none" ? "pb-0" : "pb-16";

  return (
    <div
      className={`page-shell min-h-screen bg-slate-50 font-[Poppins] ${bottomClass}`}
    >
      <div className={`page-container__inner ${sizeClass}`}>{children}</div>
    </div>
  );
};

export default PageContainer;
