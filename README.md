# Collaborative Real-Time Editor

A high-performance, real-time collaborative rich-text editor built with Next.js, Slate, and Yjs. This application allows multiple users to edit the same document concurrently over a peer-to-peer WebRTC network, with robust offline support and a built-in version history system.

## Key Features

- **Real-Time Collaboration**: See other users' cursors and edits in real-time, synced via WebRTC.
- **Rich Text Editing**: Built on top of [Slate.js](https://docs.slatejs.org/), supporting headings, bold, italic, lists, and links.
- **Image Uploads**: Drag & drop or paste images directly into the editor, powered by Cloudinary.
- **Local Persistence (Offline-First)**: Edits are continuously saved to your browser's IndexedDB. You can reload or go offline without losing data.
- **Version History & Comparison**: Save snapshots of the document and compare past versions side-by-side with color-coded author attributions in a read-only historical view.
- **Persistent Identities**: User identities are auto-generated and stored in `localStorage` to ensure consistent author tracking across sessions.

## Technology Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/) + React
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor**: [Slate](https://docs.slatejs.org/) + [slate-react](https://docs.slatejs.org/concepts/04-rendering)
- **CRDT (Collaboration)**: [Yjs](https://yjs.dev/) + `@slate-yjs/core`
- **Network Topology**: [y-webrtc](https://github.com/yjs/y-webrtc) (Full Mesh P2P)
- **Storage**: [y-indexeddb](https://github.com/yjs/y-indexeddb)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root of the project with your Cloudinary credentials for image uploading:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture & Scaling Constraints

This project uses a **Full Mesh WebRTC Topology** (`y-webrtc`) for syncing states between clients. 
- **Pros**: Lightning-fast peer-to-peer updates with zero backend infrastructure required.
- **Cons**: Network and CPU overhead scale quadratically with the number of users ($N \times (N-1) / 2$ connections).

> **Note on Load Testing**: Automated stress testing indicates that the current architecture is extremely responsive for small teams (2-10 users). Above ~15 highly active concurrent users, the full mesh WebRTC broadcasting begins to bottleneck the browser's main thread. If enterprise-scale concurrency is required, consider migrating the syncing provider to `y-websocket` backed by a central Node.js/Rust server.
