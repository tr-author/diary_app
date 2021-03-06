import { createCanvas, loadImage } from "canvas";
import { NextApiRequest, NextApiResponse } from "next";
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { columns, rows, collages } = req.body;
  const canvas = createCanvas(480 * columns, 480 * rows);
  const ctx = canvas.getContext("2d");
  console.log(req.method);
  console.log(req.body);
  console.log(columns, rows, collages);
  if (req.method === "OPTIONS") {
    console.log("now option");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).send("option method call");
  } else {
    for (let i = 0; i < columns * rows; i++) {
      if (!collages[i].url) {
        continue;
      }
      await loadImage(collages[i].url)
        .then((image) => {
          ctx.drawImage(
            image,
            (i % columns) * 480,
            Math.floor(i / columns) * 480,
            480,
            480
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }
    const buf = canvas.toBuffer("image/jpeg");
    const cacheAge = 7 * 24 * 60;
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Length", buf.length);
    res.setHeader("Cache-Control", `public, max-age=${cacheAge}`);
    res.setHeader("Expires", new Date(Date.now() + cacheAge).toUTCString());
    res.status(200).end(buf);
  }
};

export default handle;
