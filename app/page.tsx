import React from "react";
import { Chatting } from "@/components/assistant";

const Page: React.FC = () => {
  return (
      <div>
        <Chatting />
        <script type="module" src="script.js"></script>
      </div>
  );
};

export default Page;