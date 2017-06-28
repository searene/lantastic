import * as React from 'react';

export class Navbar extends React.Component<undefined, undefined> {
    render() {
        const styles = {
            container: {
                width: "50px",
                height: "100%",
                display: "flex",
                flexFlow: "row wrap",
            },
            link: {
                position: "relative",
                flex: "1 0 100%",
                textAlign: "center",
                marginTop: "10px",
            }
        };
        return (
            <div style={styles.container}>
                <a style={styles.link as any}><i className="big home icon"></i></a>
                <a style={styles.link as any}><i className="big tasks icon"></i></a>
                <a style={styles.link as any}><i className="big book icon"></i></a>
            </div>
        );
    }
}