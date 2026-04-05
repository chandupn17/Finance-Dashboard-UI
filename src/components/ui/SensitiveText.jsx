import PropTypes from 'prop-types';
import { useFinanceStore } from '../../store/useFinanceStore';

/**
 * Blurs numeric or sensitive text when privacy mode is on.
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {keyof JSX.IntrinsicElements} [props.as='span']
 */
export function SensitiveText({ children, className = '', as: Comp = 'span' }) {
  const privacy = useFinanceStore((s) => s.privacyMode);
  return (
    <Comp
      className={`${className} ${privacy ? 'blur-[7px] select-none' : ''}`.trim()}
      title={privacy ? 'Privacy mode on' : undefined}
    >
      {children}
    </Comp>
  );
}

SensitiveText.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
};
