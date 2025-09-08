import clsx from "clsx";
import PropTypes from "prop-types";
import styles from "./Buttons.module.scss";
function Buttons({ loading = false, disabled = false,
    primary = false, children, rounded = false,
    bordered = false, size = "medium", href,
    className, ...props }) {
    const Temp = href ? 'a' : 'button';
    // Ensure custom class is last for easy override
    const classNames = clsx(
        styles.wrapper,
        styles[size],
        {
            [styles.primary]: primary,
            [styles.rounded]: rounded,
            [styles.bordered]: bordered,
            [styles.disabled]: disabled,
        },
        className // custom class last for override
    );
    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <Temp
                {...props}
                href={href}
                className={clsx(classNames)}
                disabled={disabled || loading}
                style={loading ? { visibility: 'hidden' } : {}}
            >
                {children}
            </Temp>
            {loading && (
                <span className={styles.loadingIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#a423a4" strokeWidth="4" opacity="0.2" />
                        <path d="M22 12a10 10 0 0 1-10 10" stroke="#a423a4" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </span>
            )}
        </span>
    );
}
Buttons.propTypes = {
    children: PropTypes.node.isRequired,
    primary: PropTypes.bool,
    rounded: PropTypes.bool,
    bordered: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    href: PropTypes.string,
    className: PropTypes.string,
};
export default Buttons;