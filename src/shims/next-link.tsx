import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, replace, onClick, children, ...rest },
  ref
) {
  const navigate = useNavigate();

  // If external link or hash link on same page
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return (
      <a href={href} ref={ref} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      if (replace) {
        navigate(href, { replace: true });
      } else {
        navigate(href);
      }
      // Scroll to top on navigation
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterLink to={href} ref={ref} onClick={handleClick} {...rest}>
      {children}
    </RouterLink>
  );
});

export default Link;
