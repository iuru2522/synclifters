import { sizes } from "@/styles/global";

type Point = { x: number; y: number };

function insetPoint(from: Point, to: Point, distance: number): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const t = distance / length;

  return {
    x: from.x + dx * t,
    y: from.y + dy * t,
  };
}

export function getReadoutArrowPath(
  width = sizes.authReadoutArrowWidth,
  height = sizes.authReadoutArrowHeight,
  radius = sizes.authReadoutArrowRadius,
) {
  const tip: Point = { x: width / 2, y: 0 };
  const bottomLeft: Point = { x: 0, y: height };
  const bottomRight: Point = { x: width, y: height };

  const bottomLeftOnBase = insetPoint(bottomLeft, bottomRight, radius);
  const bottomLeftOnSide = insetPoint(bottomLeft, tip, radius);
  const bottomRightOnBase = insetPoint(bottomRight, bottomLeft, radius);
  const bottomRightOnSide = insetPoint(bottomRight, tip, radius);
  const tipOnLeft = insetPoint(tip, bottomLeft, radius);
  const tipOnRight = insetPoint(tip, bottomRight, radius);

  return [
    `M ${bottomLeftOnBase.x} ${bottomLeftOnBase.y}`,
    `L ${bottomRightOnBase.x} ${bottomRightOnBase.y}`,
    `Q ${bottomRight.x} ${bottomRight.y} ${bottomRightOnSide.x} ${bottomRightOnSide.y}`,
    `L ${tipOnRight.x} ${tipOnRight.y}`,
    `Q ${tip.x} ${tip.y} ${tipOnLeft.x} ${tipOnLeft.y}`,
    `L ${bottomLeftOnSide.x} ${bottomLeftOnSide.y}`,
    `Q ${bottomLeft.x} ${bottomLeft.y} ${bottomLeftOnBase.x} ${bottomLeftOnBase.y}`,
    "Z",
  ].join(" ");
}
