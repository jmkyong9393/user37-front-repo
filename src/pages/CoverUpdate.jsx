import { useState } from "react";
import CoverPreview from "../components/CoverPreview";
import CoverImageModal from "../components/CoverImageModal";

function CoverUpdate({
  book,
  onMoveToDetail,
  onGenerateCover,
  onSaveCoverImage,
}) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-image-2");
  const [quality, setQuality] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [draftCoverImage, setDraftCoverImage] = useState("");
  const previewImage = draftCoverImage || book?.coverImageUrl || "";
  const hasDraftCoverImage = Boolean(draftCoverImage);

  if (!book) {
    return (
      <>
        <main className="cover-page">
          <p>표지를 생성할 도서 정보가 없습니다.</p>
        </main>
      </>
    );
  }

  const handleGenerateCover = async () => {
    if (!apiKey.trim()) {
      alert("API Key를 입력해주세요.");
      return;
    }

    setIsGenerating(true);

    try {
      const generatedImage = await onGenerateCover({
        book,
        apiKey,
        model,
        quality,
      });

      if (generatedImage) {
        setDraftCoverImage(generatedImage);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "표지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLocalImageChange = async (e) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택해주세요.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      setDraftCoverImage(reader.result);
    };
    reader.onerror = () => {
      alert("이미지 파일을 읽지 못했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCoverImage = async () => {
    if (hasDraftCoverImage) {
      setDraftCoverImage("");
      return;
    }

    const isConfirm = window.confirm(
      "생성된 표지를 삭제하고 기본 이미지로 되돌릴까요?",
    );

    if (!isConfirm) return;

    await onSaveCoverImage(book, "");
  };

  const handleSaveCoverImage = async () => {
    if (!draftCoverImage) return;

    const savedBook = await onSaveCoverImage(book, draftCoverImage);

    if (savedBook) {
      setDraftCoverImage("");
      onMoveToDetail(savedBook);
    }
  };

  const handleCancelCoverImage = () => {
    setDraftCoverImage("");
    onMoveToDetail(book);
  };

  return (
    <>
      <main className="cover-page">
        <section className="cover-layout">
          <div className="section-card cover-form-area">
            <h2>도서 표지 생성</h2>

            <div className="form-group">
              <label>API Key *</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-xxxxxxxxxxxxxxxx"
                disabled={isGenerating}
              />
            </div>

            <div className="form-group">
              <label>모델</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={isGenerating}
              >
                <option value="gpt-image-2">gpt-Image-2.0</option>
                <option value="gpt-image-1.5">gpt-Image-1.5</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                disabled={isGenerating}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="cover-buttons">
              <button
                type="button"
                disabled={!apiKey.trim() || isGenerating}
                onClick={handleGenerateCover}
              >
                {isGenerating ? "표지 생성중" : "AI 표지 생성"}
              </button>

              {!hasDraftCoverImage && (
                <button type="button" onClick={() => onMoveToDetail(book)}>
                  취소
                </button>
              )}
            </div>

            {hasDraftCoverImage && (
              <div className="cover-buttons">
                <button type="button" onClick={handleSaveCoverImage}>
                  저장
                </button>

                <button type="button" onClick={handleCancelCoverImage}>
                  취소
                </button>
              </div>
            )}
          </div>

          <div className="section-card cover-result-area">
            <CoverPreview
              imageUrl={previewImage}
              isLoading={isGenerating}
              onDelete={handleDeleteCoverImage}
              onUploadImage={handleLocalImageChange}
              isUploadDisabled={isGenerating}
              onClick={() => {
                if (previewImage) {
                  setIsCoverOpen(true);
                }
              }}
            />

            <div className="cover-book-info">
              <h3>{book.title}</h3>
              <p>저자: {book.author}</p>
              {book.publisher && <p>출판사: {book.publisher}</p>}
              <p>{book.content}</p>
            </div>
          </div>
        </section>

        {isCoverOpen && previewImage && (
          <CoverImageModal
            imageUrl={previewImage}
            title={book.title}
            onClose={() => setIsCoverOpen(false)}
          />
        )}
      </main>
    </>
  );
}

export default CoverUpdate;
