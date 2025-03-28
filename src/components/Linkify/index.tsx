type LinkifyProps = {
  children: string;
};

const Linkify = ({ children }: LinkifyProps) => {
  const isUrl = (word: string) => {
    const urlPattern =
      // eslint-disable-next-line no-useless-escape
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return word.match(urlPattern);
  };

  const addMarkup = (word: string) => {
    return isUrl(word) ? `<a class="hover:underline" href="${word}">${word}</a>` : word;
  };

  const words: string[] = children.split(' ');
  const formatedWords: string[] = words.map((w) => addMarkup(w));
  const html: string = formatedWords.join(' ');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Linkify;
