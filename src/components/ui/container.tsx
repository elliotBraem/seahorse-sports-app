interface ContainerProps {
  title: string;
  description: string;
  isVisible?: boolean;
  children?: React.ReactNode;
}

export const Container = ({
  title,
  description,
  children,
}: ContainerProps) => {
  return (
    <div
      className={`mx-auto max-w-4xl space-y-8 px-2 md:px-6`}
    >
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
};
