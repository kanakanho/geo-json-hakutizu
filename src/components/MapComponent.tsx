"use client";
import { type ReactElement, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  height: string;
  width: string;
};

export default function MapComponent({ height, width }: Props): ReactElement {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          // 背景地図 OpenStreetMapのラスタタイル
          "background-osm-raster": {
            // ソースの種類。vector、raster、raster-dem、geojson、image、video のいずれか
            type: "raster",
            // タイルソースのURL
            tiles: ["https://tile.openstreetmap.jp/styles/osm-bright-ja/{z}/{x}/{y}.png"],
            // タイルの解像度。単位はピクセル、デフォルトは512
            tileSize: 256,
            // データの帰属
            attribution:
              "<a href='https://www.openstreetmap.org/copyright' target='_blank'>© OpenStreetMap contributors</a>",
          },
          // // 3D都市モデル（Project PLATEAU）東京都23区（2020年度）建物データ
          // "plateau-bldg": {
          //   type: "vector",
          //   tiles: ["https://indigo-lab.github.io/plateau-lod2-mvt/{z}/{x}/{y}.pbf"],
          //   minzoom: 10,
          //   maxzoom: 16,
          //   attribution:
          //     "<a href='https://github.com/indigo-lab/plateau-lod2-mvt'>plateau-lod2-mvt by indigo-lab</a> (<a href='https://www.mlit.go.jp/plateau/'>国土交通省 Project PLATEAU</a> のデータを加工して作成)",
          // },
        },
        layers: [
          // 背景地図としてOpenStreetMapのラスタタイルを追加
          {
            // 一意のレイヤID
            id: "background-osm-raster",
            // レイヤの種類。background、fill、line、symbol、raster、circle、fill-extrusion、heatmap、hillshade のいずれか
            type: "raster",
            // データソースの指定
            source: "background-osm-raster",
            layout: {
              visibility: "none",
            },
          },
          // {
          //   id: "bldg",
          //   type: "fill-extrusion",
          //   source: "plateau-bldg",
          //   // ベクタタイルソースから使用するレイヤ
          //   "source-layer": "bldg",
          //   paint: {
          //     // 高さ
          //     "fill-extrusion-height": ["*", ["get", "z"], 1],
          //     // 塗りつぶしの色
          //     "fill-extrusion-color": "#797979",
          //     // 透明度
          //     "fill-extrusion-opacity": 0.7,
          //   },
          // },
        ],
      },
      center: [137.1130419, 35.1834122],
      zoom: 12,
    });

    map.current.on("load", () => {
      if (map.current) {
        // map.current.addSource("geojson-source", {
        //   type: "geojson",
        //   data: "./N03-19_23_190101.geojson",
        // });

        // map.current.addSource("geojson-source", {
        //   type: "geojson",
        //   data: "./N03-23_230101.geojson",
        // });

        map.current.addSource("geojson-source", {
          type: "geojson",
          data: "./data.json",
        });

        // ポリゴンの枠線を設定します
        map.current.addLayer({
          id: "outline",
          type: "line",
          source: "geojson-source", // 修正: 正しいソースIDを指定
          layout: {},
          paint: {
            "line-color": "#333333",
            "line-width": 3,
          },
        });
      }
    });

    if (!map.current) return;
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        height: height,
        width: width,
      }}
    />
  );
}
