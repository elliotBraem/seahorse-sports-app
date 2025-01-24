interface ContainerProps {
  title?: string;
  description?: string;

  children?: React.ReactNode;
}

export const Container = ({ title, description, children }: ContainerProps) => {
  return (
    <div className="mx-auto max-w-4xl py-5 px-4 md:px-6 space-y-4 overflow-y-auto">
      {(title || description) && (
        <div>
          {title && <h1 className="text-3xl font-bold text-white">{title}</h1>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
