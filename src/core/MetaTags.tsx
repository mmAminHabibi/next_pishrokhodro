type Props = {
  metaTags: MetaTagsInterface[];
};

export default function MetaTags({ metaTags }: Props) {
  return (
    <>
      {metaTags.map((tag, idx) => (
        <meta key={idx} name={tag.title} content={tag.body} />
      ))}
    </>
  );
}
