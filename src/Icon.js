import React from 'react';

const Icon = ({ story }) => {
    return (
        <div
            className="marker"
            style={{
                backgroundImage: `url(icons/${story.type}.png)`,
                width: '50px',
                height: '50px',
                backgroundSize: '100%',
                display: 'block',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                padding: 0
            }}
        />
    );
};

export default Icon;
