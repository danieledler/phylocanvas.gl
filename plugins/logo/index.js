import { IconLayer } from "@deck.gl/layers";

export default function () {

  const layer = new IconLayer({
    id: "logo",
    data: [
      {
        url: "data:image/png;base64,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",
      },
    ],
    getIcon: (x) => ({
      url: x.url,
      width: 67,
      height: 16,
    }),
    getSize: 16,
    pickable: true,
    getPosition: (x) => [0, 0],
  });

  return layer;
}
