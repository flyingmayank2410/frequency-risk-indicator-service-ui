const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#181818',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#ddd',
    WebkitFontSmoothing: 'antialiased',
  },
  sidebar: {
    width: 300,
    minWidth: 240,
    backgroundColor: '#20232a',
    borderRight: '1px solid #333',
    padding: '28px 16px 0 12px',
    boxShadow: '2px 0 8px rgba(0,0,0,0.45)',
    overflowY: 'auto',
    color: '#f4f4f4',
    fontSize: 15,
    lineHeight: 1.7,
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#181818',
    color: '#eee',
    padding: 32,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  panelContainer: {
    display: 'flex',
    gap: 22,
    marginBottom: 35,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  panel: {
    backgroundColor: '#23272f',
    borderRadius: 18,
    padding: 28,
    minWidth: 240,
    flex: '1 1 260px',
    maxWidth: 350,
    boxShadow: '0 8px 26px rgba(0,0,0,0.43)',
    color: '#edeff1',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  panelHeader: {
    fontSize: 21,
    fontWeight: 700,
    color: '#70ea82',
    marginBottom: 16,
    letterSpacing: '0.07em'
  },
  chartPanel: {
    backgroundColor: '#22252b',
    borderRadius: 16,
    boxShadow: '0 3px 14px rgba(0,0,0,0.13)',
    padding: 26,
    marginBottom: 20,
    color: '#e0e1e3',
    flex: '1 1 430px',
    minWidth: 370,
    display: 'flex',
    flexDirection: 'column'
  },
  chartTitle: {
    fontSize: 19,
    fontWeight: 600,
    color: '#97aaff',
    marginBottom: 18,
    letterSpacing: '0.02em'
  },
  legend: {
    color: '#d5d7db',
    fontWeight: 600,
    fontSize: 15,
  }
};
export default styles;
