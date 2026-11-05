import React from 'react';
import { TVElement } from './TVElement';
import { CameraElement } from './CameraElement';
import { PhotoRollElement } from './PhotoRollElement';

export interface FigmaTextSpec {
  characters: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeightPx: number | null;
  letterSpacing: number;
  textAlignHorizontal: string;
  textAlignVertical: string;
  italic: boolean;
}

export interface FigmaBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigmaNodeSpec {
  id: string;
  name: string;
  type: string;
  box: FigmaBox | null;
  renderBox: FigmaBox | null;
  rotationDeg: number;
  clipsContent: boolean;
  cornerRadius: number;
  fillColor: string | null;
  strokeColor: string | null;
  strokeWeight: number;
  strokeAlign: string | null;
  imageRef: string | null;
  scaleMode: string | null;
  imageTransform: number[][] | null;
  renderedPng: string | null;
  renderedSvg: string | null;
  rawImageUrl: string | null;
  text?: FigmaTextSpec;
  children?: FigmaNodeSpec[];
}

export interface FigmaFrameSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  children: FigmaNodeSpec[];
}

interface FigmaFrameCanvasProps {
  frame: FigmaFrameSpec;
  scale: number;
}

export const FigmaFrameCanvas: React.FC<FigmaFrameCanvasProps> = ({ frame, scale }) => {
  const renderNode = (node: FigmaNodeSpec, zIndex: number): React.ReactNode => {
    if (!node.box) return null;

    // 1. Special interactive CRT Television node
    if (node.name === 'Hero_Television_Image' && node.renderedPng) {
      const rb = node.renderBox || node.box;
      return (
        <TVElement
          key={node.id}
          src={node.renderedPng}
          alt="Hero Television"
          x={rb.x}
          y={rb.y}
          width={rb.width}
          height={rb.height}
          zIndex={zIndex}
        />
      );
    }

    // 2. Special interactive Canon Digital Camera node
    if (node.name === 'Profile_Image' && node.renderedPng) {
      const rb = node.renderBox || node.box;
      return (
        <CameraElement
          key={node.id}
          src={node.renderedPng}
          alt="Canon Camera Profile"
          x={rb.x}
          y={rb.y}
          width={rb.width}
          height={rb.height}
          zIndex={zIndex}
        />
      );
    }

    // 2b. Authentic Figma Photo Roll / Filmstrip nodes (Projects_Filmstrip_Divider_01 & Projects_Contact_Filmstrip_Transition)
    if (
      (node.name === 'Projects_Filmstrip_Divider_01' ||
        node.name === 'Projects_Contact_Filmstrip_Transition') &&
      node.rawImageUrl &&
      node.renderedPng
    ) {
      const rb = node.renderBox || node.box;
      return (
        <PhotoRollElement
          key={node.id}
          nodeId={node.id}
          name={node.name}
          rawImageUrl={node.rawImageUrl}
          renderedPng={node.renderedPng}
          x={rb.x}
          y={rb.y}
          width={rb.width}
          height={rb.height}
          zIndex={zIndex}
        />
      );
    }

    // 3. TEXT Nodes — rendered with exact Figma font family, size, lineHeight, color, stroke, and coordinates
    if (node.type === 'TEXT' && node.text) {
      const t = node.text;
      const b = node.box;
      const hasStroke = node.strokeColor && node.strokeWeight > 0;
      // Figma OUTSIDE stroke is double width when using paint-order: stroke fill
      const cssStrokeWidth = hasStroke
        ? node.strokeAlign === 'OUTSIDE'
          ? node.strokeWeight * 2
          : node.strokeWeight * 1.8
        : 0;

      const textStyle: React.CSSProperties = {
        position: 'absolute',
        left: `${b.x}px`,
        top: `${b.y}px`,
        width: `${b.width}px`,
        minHeight: `${b.height}px`,
        fontFamily: `"${t.fontFamily}", sans-serif`,
        fontWeight: t.fontWeight,
        fontSize: `${t.fontSize}px`,
        lineHeight: t.lineHeightPx ? `${t.lineHeightPx}px` : 'normal',
        letterSpacing: t.letterSpacing ? `${t.letterSpacing}px` : '0px',
        textAlign: (t.textAlignHorizontal.toLowerCase() as React.CSSProperties['textAlign']) || 'left',
        fontStyle: t.italic ? 'italic' : 'normal',
        color: node.fillColor || '#000000',
        WebkitTextStroke: hasStroke ? `${cssStrokeWidth}px ${node.strokeColor}` : undefined,
        paintOrder: hasStroke ? 'stroke fill' : undefined,
        strokeLinejoin: 'round',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        margin: 0,
        padding: 0,
        zIndex,
        pointerEvents: 'auto',
      };

      // Make email and social handle clickable links while preserving 100% identical visual styling
      if (node.name === 'Contact_Email') {
        return (
          <a
            key={node.id}
            href={`mailto:${t.characters.trim()}`}
            style={{ ...textStyle, textDecoration: 'none' }}
          >
            {t.characters}
          </a>
        );
      }

      if (node.name.includes('Social_Handle')) {
        return (
          <a
            key={node.id}
            href="https://instagram.com/mr_hmmz"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...textStyle, textDecoration: 'none' }}
          >
            {t.characters}
          </a>
        );
      }

      return (
        <div key={node.id} data-node-id={node.id} data-node-name={node.name} style={textStyle}>
          {t.characters}
        </div>
      );
    }

    // 4. BOOLEAN_OPERATION or COMPONENT (e.g., Projects_Logo_Border, Project_Card_Logo_01..04, Icon / Photoshop, etc.)
    // Using the exact Figma API renderedPng at renderBox coordinates preserves exact boolean subtraction, crop matrices, and rotations!
    if (
      (node.type === 'BOOLEAN_OPERATION' || node.type === 'COMPONENT') &&
      node.renderedPng
    ) {
      const rb = node.renderBox || node.box;
      return (
        <img
          key={node.id}
          data-node-id={node.id}
          data-node-name={node.name}
          src={node.renderedPng}
          alt={node.name}
          draggable={false}
          style={{
            position: 'absolute',
            left: `${rb.x}px`,
            top: `${rb.y}px`,
            width: `${rb.width}px`,
            height: `${rb.height}px`,
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex,
          }}
        />
      );
    }

    // 5. VECTOR or LINE nodes (decorative circuit lines)
    if ((node.type === 'VECTOR' || node.type === 'LINE') && node.renderedSvg) {
      const rb = node.renderBox || node.box;
      return (
        <img
          key={node.id}
          data-node-id={node.id}
          data-node-name={node.name}
          src={node.renderedSvg}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: 'absolute',
            left: `${rb.x}px`,
            top: `${rb.y}px`,
            width: `${rb.width}px`,
            height: `${rb.height}px`,
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex,
          }}
        />
      );
    }

    // 6. Leaf RECTANGLE with an image fill (renderedPng from Figma API includes exact imageTransform crop and rotation)
    if (node.renderedPng && (!node.children || node.children.length === 0)) {
      const rb = node.renderBox || node.box;
      return (
        <img
          key={node.id}
          data-node-id={node.id}
          data-node-name={node.name}
          src={node.renderedPng}
          alt={node.name}
          draggable={false}
          style={{
            position: 'absolute',
            left: `${rb.x}px`,
            top: `${rb.y}px`,
            width: `${rb.width}px`,
            height: `${rb.height}px`,
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex,
          }}
        />
      );
    }

    // 7. Solid color RECTANGLE (e.g., Marquee_Background #131212)
    if (node.type === 'RECTANGLE' && node.fillColor && (!node.children || node.children.length === 0)) {
      const b = node.box;
      return (
        <div
          key={node.id}
          data-node-id={node.id}
          data-node-name={node.name}
          style={{
            position: 'absolute',
            left: `${b.x}px`,
            top: `${b.y}px`,
            width: `${b.width}px`,
            height: `${b.height}px`,
            backgroundColor: node.fillColor,
            borderRadius: node.cornerRadius ? `${node.cornerRadius}px` : undefined,
            zIndex,
          }}
        />
      );
    }

    // 8. Container FRAME / GROUP:
    // If clipsContent is true on this frame, clip children to this frame's bounding box; otherwise render children in global frame space
    if (node.children && node.children.length > 0) {
      if (node.clipsContent && node.box) {
        const b = node.box;
        return (
          <div
            key={node.id}
            data-node-id={node.id}
            data-node-name={node.name}
            style={{
              position: 'absolute',
              left: `${b.x}px`,
              top: `${b.y}px`,
              width: `${b.width}px`,
              height: `${b.height}px`,
              overflow: 'hidden',
              zIndex,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: `${-b.x}px`,
                top: `${-b.y}px`,
                width: `${frame.width}px`,
                height: `${frame.height}px`,
              }}
            >
              {node.children.map((child, idx) => renderNode(child, zIndex + idx + 1))}
            </div>
          </div>
        );
      }

      return (
        <React.Fragment key={node.id}>
          {node.children.map((child, idx) => renderNode(child, zIndex + idx + 1))}
        </React.Fragment>
      );
    }

    return null;
  };

  const scaledHeight = frame.height * scale;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 'none',
        height: `${scaledHeight}px`,
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <div
        data-frame-id={frame.id}
        data-frame-name={frame.name}
        style={{
          width: `${frame.width}px`,
          height: `${frame.height}px`,
          backgroundColor: frame.backgroundColor || '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
      >
        {frame.children.map((section, sIdx) => renderNode(section, (sIdx + 1) * 100))}
      </div>
    </div>
  );
};
