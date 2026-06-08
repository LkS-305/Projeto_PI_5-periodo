"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useNotification } from "@/lib/contexts/NotificationContext";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { ROUTES } from "@/lib/routes";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaItem {
  type: "photo" | "video";
  url?: string;
}

interface Post {
  backendId: string;
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  media: MediaItem[];
  pinned: boolean;
}


// ─── MediaStrip (scroll horizontal de fotos e vídeos) ────────────────────────

function MediaStrip({
  media,
  itemW,
  itemH,
}: {
  media: MediaItem[];
  itemW: number;
  itemH: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const update = () => {
      const items = container.querySelectorAll<HTMLDivElement>(".media-item");
      const cLeft = container.getBoundingClientRect().left;
      const cRight = container.getBoundingClientRect().right;
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        const full = r.left >= cLeft - 1 && r.right <= cRight + 1;
        item.style.backgroundColor = full ? "#535353" : "#A7A6A4";
      });
    };
    update();
    container.addEventListener("scroll", update, { passive: true });
    return () => container.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={ref}
      className="media-scroll"
      style={{
        display: "flex",
        gap: "15px",
        overflowX: "auto",
        overflowY: "hidden",
        paddingLeft: "20px",
        paddingRight: "20px",
        height: `${itemH}px`,
        alignItems: "center",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      } as React.CSSProperties}
    >
      {media.map((m, i) => (
        <div
          key={i}
          className="media-item"
          style={{
            flexShrink: 0,
            width: `${itemW}px`,
            height: `${itemH}px`,
            backgroundColor: "#535353",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {m.url ? (
            m.type === "video" ? (
              <video
                src={`${process.env.NEXT_PUBLIC_API_URL}${m.url}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                muted
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${m.url}`}
                alt="portfolio"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )
          ) : (
            <Image
              src={m.type === "video" ? "/images/play.svg" : "/images/picture.svg"}
              alt={m.type}
              width={m.type === "video" ? 40 : 48}
              height={40}
              style={{ display: "block" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Pinned Card ──────────────────────────────────────────────────────────────

function PinnedCard({
  post,
  onUnpin,
}: {
  post: Post;
  onUnpin: (id: number) => void;
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: "550px",
        borderRadius: "36px",
        backgroundColor: "rgba(39, 39, 39, 0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "4px solid #C3A85E",
        boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Topo: categoria + pin badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 28px 20px",
        }}
      >
        <span
          style={{
            padding: "6px 20px",
            backgroundColor: "rgba(224,194,113,0.18)",
            border: "1.5px solid #E0C271",
            borderRadius: "30px",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "22px",
            color: "#E0C271",
          }}
        >
          {post.category}
        </span>

        {/* Pin badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            backgroundColor: "rgba(224,194,113,0.15)",
            border: "1.5px solid #E0C271",
            borderRadius: "30px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#E0C271">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
          <span
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              color: "#E0C271",
            }}
          >
            Destacado
          </span>
        </div>
      </div>

      {/* Mídia */}
      <MediaStrip media={post.media} itemW={110} itemH={155} />

      {/* Info */}
      <div style={{ padding: "20px 28px 0" }}>
        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "28px",
            color: "#FAF9F5",
            margin: 0,
            lineHeight: 1.25,
            marginBottom: "10px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {post.title}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "18px",
          }}
        >
          <Image src="/images/location.svg" alt="local" width={16} height={18} />
          <span
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "22px",
              color: "#8E8D8C",
            }}
          >
            {post.location} · {post.date}
          </span>
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: "8px",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          {post.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                padding: "4px 14px",
                backgroundColor: "#4a4a4a",
                borderRadius: "20px",
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                color: "#C8C7C5",
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Botão desafixar */}
      <div style={{ padding: "0 28px 28px", marginTop: "auto" }}>
        <button
          onClick={() => onUnpin(post.id)}
          style={{
            width: "100%",
            height: "54px",
            borderRadius: "30px",
            backgroundColor: "transparent",
            border: "2px solid rgba(195,168,94,0.5)",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "24px",
            color: "#8E8D8C",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#D92B2E";
            e.currentTarget.style.color = "#D92B2E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(195,168,94,0.5)";
            e.currentTarget.style.color = "#8E8D8C";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Desafixar
        </button>
      </div>
    </div>
  );
}

// ─── Feed Card ────────────────────────────────────────────────────────────────

function FeedCard({
  post,
  pinnedCount,
  onTogglePin,
  onDelete,
}: {
  post: Post;
  pinnedCount: number;
  onTogglePin: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canPin = post.pinned || pinnedCount < 3;

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "36px",
        backgroundColor: "#FAF9F5",
        border: `4px solid ${post.pinned ? "#C3A85E" : "#E0C271"}`,
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        transition: "box-shadow 0.2s",
        boxShadow: post.pinned ? "0 4px 24px rgba(195,168,94,0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(224,194,113,0.22)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = post.pinned
          ? "0 4px 24px rgba(195,168,94,0.2)"
          : "none";
      }}
    >
      {/* ── Topo: categoria + data + local ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 40px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            style={{
              padding: "7px 22px",
              backgroundColor: "rgba(224,194,113,0.15)",
              border: "1.5px solid #E0C271",
              borderRadius: "30px",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              color: "#C3A85E",
            }}
          >
            {post.category}
          </span>
          {post.pinned && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                backgroundColor: "rgba(224,194,113,0.1)",
                border: "1.5px solid rgba(224,194,113,0.5)",
                borderRadius: "30px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#E0C271">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              <span
                style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "20px",
                  color: "#C3A85E",
                }}
              >
                Destacado
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#535353",
          }}
        >
          <Image src="/images/location.svg" alt="local" width={18} height={20} />
          <span
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "24px",
              color: "#535353",
            }}
          >
            {post.location} · {post.date}
          </span>
        </div>
      </div>

      {/* ── Mídia ── */}
      <MediaStrip media={post.media} itemW={130} itemH={180} />

      {/* ── Título + Descrição ── */}
      <div style={{ padding: "24px 40px 0" }}>
        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "34px",
            color: "#272727",
            margin: 0,
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          {post.title}
        </p>
        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "26px",
            color: "#535353",
            margin: 0,
            lineHeight: 1.5,
            textAlign: "justify",
          }}
        >
          {post.description}
        </p>
      </div>

      {/* ── Rodapé: tags + ações ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 40px 30px",
          marginTop: "8px",
        }}
      >
        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {post.tags.map((t) => (
            <span
              key={t}
              style={{
                padding: "6px 18px",
                backgroundColor: "#EAEAEA",
                borderRadius: "30px",
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "24px",
                color: "#535353",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Ações */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
          {/* Botão Fixar / Desafixar */}
          <button
            onClick={() => onTogglePin(post.id)}
            title={
              !canPin
                ? "Limite de 3 destaques atingido"
                : post.pinned
                ? "Desafixar destaque"
                : "Fixar como destaque"
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              height: "56px",
              borderRadius: "30px",
              backgroundColor: post.pinned
                ? "rgba(224,194,113,0.12)"
                : "transparent",
              border: `2px solid ${post.pinned ? "#E0C271" : "#DEDEDE"}`,
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              color: post.pinned ? "#C3A85E" : !canPin ? "#AAAAAA" : "#535353",
              cursor: canPin ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              opacity: !canPin ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!canPin) return;
              if (!post.pinned) {
                e.currentTarget.style.borderColor = "#E0C271";
                e.currentTarget.style.color = "#C3A85E";
              }
            }}
            onMouseLeave={(e) => {
              if (!canPin) return;
              if (!post.pinned) {
                e.currentTarget.style.borderColor = "#DEDEDE";
                e.currentTarget.style.color = "#535353";
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={post.pinned ? "#C3A85E" : "currentColor"}>
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
            {post.pinned ? "Destacado" : "Destacar"}
          </button>

          {/* Botão Editar */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              height: "56px",
              borderRadius: "30px",
              backgroundColor: "transparent",
              border: "2px solid #DEDEDE",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              color: "#535353",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#272727";
              e.currentTarget.style.color = "#272727";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#DEDEDE";
              e.currentTarget.style.color = "#535353";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>

          {/* Botão Excluir */}
          {confirmDelete ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => onDelete(post.id)}
                style={{
                  padding: "12px 22px",
                  height: "56px",
                  borderRadius: "30px",
                  backgroundColor: "#D92B2E",
                  border: "none",
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "22px",
                  color: "#FAF9F5",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Confirmar exclusão
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: "12px 22px",
                  height: "56px",
                  borderRadius: "30px",
                  backgroundColor: "transparent",
                  border: "2px solid #DEDEDE",
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "22px",
                  color: "#535353",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "2px solid #DEDEDE",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#D92B2E";
                e.currentTarget.style.backgroundColor = "rgba(217,43,46,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DEDEDE";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#535353" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function PortifolioPage() {
  const router = useRouter();
  const { notify } = useNotification();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // ── Upload modal state ──
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = getCurrentUserId();

  const loadPortfolio = async () => {
    if (!userId) { setLoadingPosts(false); return; }
    try {
      const itens = await ClientGateway.getPortfolio(userId);
      const mapeados: Post[] = itens.map((item, i) => ({
        backendId: item.id,
        id: i + 1,
        title: item.descricao || "Trabalho do portfólio",
        category: "",
        description: item.descricao || "",
        date: "",
        location: "",
        tags: [],
        media: [{ type: item.tipo === "video" ? "video" : "photo", url: item.url }],
        pinned: false,
      }));
      setPosts(mapeados);
    } catch {
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => { loadPortfolio(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pinned = posts.filter((p) => p.pinned);
  const pinnedCount = pinned.length;

  const handleTogglePin = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    if (post.pinned) {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, pinned: false } : p))
      );
      notify("Trabalho removido dos destaques.", "info");
    } else {
      if (pinnedCount >= 3) {
        notify(
          "Limite de 3 destaques atingido. Remova um para adicionar outro.",
          "error"
        );
        return;
      }
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, pinned: true } : p))
      );
      notify("Trabalho adicionado aos destaques!", "success");
    }
  };

  const handleDelete = async (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post || !userId) return;
    try {
      await ClientGateway.deletePortfolioItem(post.backendId, userId);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      notify(`Trabalho excluído com sucesso.`, "info");
    } catch (err: any) {
      notify(err?.message || "Erro ao excluir trabalho.", "error");
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !userId) return;
    setUploading(true);
    setUploadError("");
    try {
      await ClientGateway.uploadPortfolioItem(userId, uploadFile, uploadDescription);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadDescription("");
      notify("Trabalho adicionado ao portfólio!", "success");
      setLoadingPosts(true);
      await loadPortfolio();
    } catch (err: any) {
      setUploadError(err?.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#FAF9F5",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
      }}
    >
      <style>{`
        .media-scroll::-webkit-scrollbar { display: none; }
        .media-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .media-item { transition: background-color 0.2s; }

        .upload-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(39,39,39,0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .upload-modal {
          background: #FAF9F5;
          border-radius: 32px;
          padding: 48px;
          width: min(640px, 92vw);
          box-shadow: 0 20px 60px rgba(0,0,0,0.22);
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeSlideIn 0.25s ease forwards;
        }
        .upload-modal__title {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(1.5rem, 2.5vw, 2.5rem);
          font-weight: 700;
          color: #272727;
          margin: 0;
        }
        .upload-modal__label {
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.3vw, 1.25rem);
          font-weight: 500;
          color: #272727;
          display: block;
          margin-bottom: 8px;
        }
        .upload-modal__drop-zone {
          width: 100%;
          min-height: 120px;
          border: 2px dashed #E0C271;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          background: #fdf8ee;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
          padding: 16px;
        }
        .upload-modal__drop-zone:hover {
          border-color: #C3A85E;
          background: #f7f0db;
        }
        .upload-modal__drop-zone--has-file {
          border-style: solid;
          border-color: #C3A85E;
        }
        .upload-modal__drop-text {
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.2vw, 1.125rem);
          color: #535353;
          text-align: center;
          margin: 0;
        }
        .upload-modal__textarea {
          width: 100%;
          border: 1.5px solid #E0C271;
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.2vw, 1.125rem);
          color: #272727;
          background: #fdf8ee;
          resize: vertical;
          min-height: 80px;
          outline: none;
          box-sizing: border-box;
        }
        .upload-modal__textarea:focus {
          border-color: #C3A85E;
        }
        .upload-modal__actions {
          display: flex;
          gap: 14px;
          justify-content: flex-end;
        }
        .upload-modal__btn-cancel {
          padding: 12px 28px;
          border-radius: 50px;
          border: 2px solid #DEDEDE;
          background: transparent;
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.2vw, 1.125rem);
          font-weight: 500;
          color: #535353;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .upload-modal__btn-cancel:hover { border-color: #272727; color: #272727; }
        .upload-modal__btn-submit {
          padding: 12px 32px;
          border-radius: 50px;
          border: none;
          background: #E0C271;
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.2vw, 1.125rem);
          font-weight: 600;
          color: #272727;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .upload-modal__btn-submit:hover:not(:disabled) { opacity: 0.88; transform: scale(1.02); }
        .upload-modal__btn-submit:disabled { opacity: 0.55; cursor: default; }
        .upload-modal__error {
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.75rem, 1vw, 0.9375rem);
          color: #D92B2E;
          margin: 0;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeSlideIn 0.45s ease forwards; }

        .pinned-row::-webkit-scrollbar { display: none; }
        .pinned-row { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CONTEÚDO                                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="fade-in"
        style={{
          paddingLeft: "105px",
          paddingRight: "105px",
          paddingTop: "50px",
          paddingBottom: "100px",
        }}
      >
        {/* ── Título + Botão adicionar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <div>
            <div
              onClick={() => router.push(ROUTES.hub)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "28px",
                fontWeight: 500,
                color: "#535353",
                cursor: "pointer",
                marginBottom: "18px",
                userSelect: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#272727")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#535353")}
            >
              ← Voltar
            </div>
            <h1
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 600,
                fontSize: "90px",
                color: "#E0C271",
                lineHeight: 1,
                margin: 0,
                letterSpacing: "-2px",
              }}
            >
              Portifólio
            </h1>
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: "30px",
                color: "#535353",
                margin: 0,
                marginTop: "10px",
              }}
            >
              {posts.length} {posts.length === 1 ? "trabalho publicado" : "trabalhos publicados"}
            </p>
          </div>

          {/* Botão novo trabalho */}
          <button
            onClick={() => { setUploadError(""); setShowUploadModal(true); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "0 40px",
              height: "70px",
              borderRadius: "50px",
              backgroundColor: "#E0C271",
              border: "none",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "28px",
              color: "#272727",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#272727" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar trabalho
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* SEÇÃO: TRABALHOS EM DESTAQUE                                        */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: "50px", marginBottom: "70px" }}>
          {/* Cabeçalho da seção */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "44px",
                borderRadius: "5px",
                backgroundColor: "#E0C271",
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "44px",
                color: "#272727",
                margin: 0,
              }}
            >
              Trabalhos em Destaque
            </p>
            <span
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "28px",
                color: "#8E8D8C",
                marginLeft: "4px",
              }}
            >
              {pinnedCount}/3 fixados
            </span>
          </div>

          {/* Linha dourada fina */}
          <div
            style={{
              width: "100%",
              height: "1.5px",
              backgroundColor: "rgba(195,168,94,0.3)",
              marginBottom: "30px",
            }}
          />

          {pinned.length === 0 ? (
            /* Estado vazio dos destaques */
            <div
              style={{
                width: "100%",
                height: "200px",
                borderRadius: "36px",
                border: "3px dashed rgba(195,168,94,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C3A85E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              <p
                style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "26px",
                  color: "#8E8D8C",
                  margin: 0,
                }}
              >
                Nenhum trabalho em destaque. Fixe até 3 trabalhos do feed abaixo.
              </p>
            </div>
          ) : (
            /* Cards dos trabalhos fixados */
            <div
              className="pinned-row"
              style={{
                display: "flex",
                gap: "30px",
                overflowX: "auto",
                paddingBottom: "8px",
              }}
            >
              {pinned.map((post) => (
                <PinnedCard
                  key={post.id}
                  post={post}
                  onUnpin={handleTogglePin}
                />
              ))}

              {/* Slots vazios */}
              {Array.from({ length: 3 - pinned.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  style={{
                    flexShrink: 0,
                    width: "550px",
                    height: "480px",
                    borderRadius: "36px",
                    border: "3px dashed rgba(195,168,94,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "14px",
                    opacity: 0.6,
                  }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C3A85E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  <p
                    style={{
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: "24px",
                      color: "#8E8D8C",
                      margin: 0,
                      textAlign: "center",
                      maxWidth: "320px",
                    }}
                  >
                    Slot disponível
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* SEÇÃO: FEED DE TRABALHOS                                            */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div>
          {/* Cabeçalho da seção */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "44px",
                borderRadius: "5px",
                backgroundColor: "#272727",
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "44px",
                color: "#272727",
                margin: 0,
              }}
            >
              Todos os trabalhos
            </p>
          </div>

          <div
            style={{
              width: "100%",
              height: "1.5px",
              backgroundColor: "#EAEAEA",
              marginBottom: "30px",
            }}
          />

          {/* Feed */}
          {loadingPosts ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "30px", color: "#8E8D8C", margin: 0 }}>
                Carregando portfólio...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                gap: "20px",
              }}
            >
              <p
                style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "30px",
                  color: "#8E8D8C",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Nenhum trabalho publicado ainda. Adicione seu primeiro trabalho!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              {posts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  pinnedCount={pinnedCount}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL DE UPLOAD ─────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div
          className="upload-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowUploadModal(false); setUploadFile(null); setUploadDescription(""); setUploadError(""); } }}
        >
          <div className="upload-modal">
            <h2 className="upload-modal__title">Adicionar trabalho</h2>

            <div>
              <label className="upload-modal__label">Arquivo (imagem ou vídeo) *</label>
              <div
                className={`upload-modal__drop-zone${uploadFile ? " upload-modal__drop-zone--has-file" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadFile ? (
                  <>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C3A85E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="upload-modal__drop-text" style={{ color: "#272727", fontWeight: 500 }}>{uploadFile.name}</p>
                    <p className="upload-modal__drop-text" style={{ fontSize: "0.8em" }}>
                      {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB · Clique para trocar
                    </p>
                  </>
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C3A85E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="upload-modal__drop-text">Clique para selecionar uma imagem ou vídeo</p>
                    <p className="upload-modal__drop-text" style={{ fontSize: "0.85em", color: "#8E8D8C" }}>Máximo 20 MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={(e) => { setUploadFile(e.target.files?.[0] ?? null); setUploadError(""); }}
                />
              </div>
            </div>

            <div>
              <label className="upload-modal__label">Descrição (opcional)</label>
              <textarea
                className="upload-modal__textarea"
                placeholder="Descreva o trabalho realizado..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                maxLength={500}
              />
            </div>

            {uploadError && <p className="upload-modal__error">{uploadError}</p>}

            <div className="upload-modal__actions">
              <button
                className="upload-modal__btn-cancel"
                onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadDescription(""); setUploadError(""); }}
              >
                Cancelar
              </button>
              <button
                className="upload-modal__btn-submit"
                onClick={handleUploadSubmit}
                disabled={!uploadFile || uploading}
              >
                {uploading ? "Enviando..." : "Publicar trabalho"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
