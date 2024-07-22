import Ttorc from "./src/ttorc/ttorc.js";

async function go() {
  const ttorc = new Ttorc(
    "4c2d37786ec5480c0f4edc6b688ac24c",
    "e5cf8ccc7e40a0cf260aea741978f5e9",
    "42",
    "d355d3bf29d3c17c463aafb0e0a5748b"
  );
  const res = await ttorc.createTask();
  const response = await ttorc.getResponse(res);
  console.log(response);
}

(async () => {
  await go();
})();
