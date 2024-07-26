import { ExternalLink } from "./external-link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
      <p>
        Made with love by{" "}
        <ExternalLink href="https://bento.me/louremipsum">
          louremipsum aka Vinayak
        </ExternalLink>
      </p>
    </footer>
  );
};

export default Footer;
