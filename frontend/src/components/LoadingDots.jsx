/**
 * LoadingDots — animated three-dot indicator shown while AI is generating.
 */
export default function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1" aria-label="Loading answer">
      <span className="loading-dot" />
      <span className="loading-dot" />
      <span className="loading-dot" />
    </div>
  )
}
