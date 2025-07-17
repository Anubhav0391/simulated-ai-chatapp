"use client";

import React, { Fragment, memo } from "react";

const ChatSkeletons = ({ n = 1 }: { n?: number }) => {
  return new Array(n).fill(0).map((_, i) => (
    <Fragment key={i}>
      <div className="bg-accent animate-pulse p-6 w-[50%] rounded-[20px] rounded-tr-[2px] self-end" />
      <div className="bg-accent animate-pulse p-6 w-[80%] rounded-[20px] rounded-tl-[2px] self-start" />
    </Fragment>
  ));
};

export default memo(ChatSkeletons);
