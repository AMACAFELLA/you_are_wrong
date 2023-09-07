export const parseFoundText = (text: string, search: string) => {
  search = search.toLowerCase();
  const textArray = text.split("");
  const index = text.toLowerCase().search(search);
  const length = search.length;
  if (index > -1) {
    return (
      <>
        {text.substring(0, index)}
        <span className="text-primary-500">
          {text.substring(index, index + length)}
        </span>
        {text.substring(index + length, textArray.length)}
      </>
    );
  } else {
    return <>{text}</>;
  }
};
