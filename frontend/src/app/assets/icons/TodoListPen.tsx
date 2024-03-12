// icon:basic_todolist_pen | Linea Iconset https://linea.io/ | Benjamin Sigidi
import * as React from "react";

function TodoListPen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M16 24h22M16 34h22M16 44h22M16 54h22M12 24H8M12 34H8M12 44H8M12 54H8M14 8H1v55h44V8H32"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M27 5V1h-8v4h-4l-2 8h20l-2-8zM63 3v50l-4 8-4-8V3zM55 7h-4v10"
      />
    </svg>
  );
}

export default TodoListPen;
