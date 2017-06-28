import * as React from 'react';

interface FooterProps {
    type: string;
    deck: string;
}
export class Footer extends React.Component<FooterProps, undefined> {
    render() {
        const styles = {
            container: {
                display: "flex",
                backgroundColor: "#F1F1F1",
                height: "30px",
                padding: "0 10px 0 10px",
                width: "100%",
                marginTop: "auto",
                alignItems: "center",
            },
            iconContainer: {
                marginRight: "15px",
            },
        }
        return (
            <footer style={styles.container as any}>
                <div style={styles.iconContainer}><i className="book icon"></i>Deck: <b>{this.props.deck}</b></div>
                <div style={styles.iconContainer}><i className="tasks icon"></i>Type: <b>{this.props.type}</b></div>
            </footer>
        );
    }
}