/**
 * Renders trusted, brief-supplied HTML content inside the branded `.rich` scope.
 * Content originates from the project brief (not user input), so this is safe.
 */
export default function RichContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`rich ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
