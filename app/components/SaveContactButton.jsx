// "use client";

// import { useState } from 'react';

// export default function SaveContactButton({ profile }) {
//     if (!profile) return null;

//     const generateVCard = () => {
//         // Construct vCard 3.0 string
//         const vcard = [
//             'BEGIN:VCARD',
//             'VERSION:3.0',
//             `FN:${profile.businessName || 'Business'}`,
//             `ORG:${profile.businessName || 'Business'}`,
//             profile.phone ? `TEL;TYPE=WORK,VOICE:${profile.phone}` : '',
//             profile.email ? `EMAIL:${profile.email}` : '',
//             profile.website ? `URL:${profile.website}` : '',
//             profile.address ? `ADR;TYPE=WORK:;;${profile.address};${profile.city || ''};${profile.state || ''};${profile.pincode || ''};` : '',
//             `NOTE:${profile.description || 'Saved from Review Generator'}`,
//             'END:VCARD'
//         ].filter(Boolean).join('\n');

//         const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `${profile.businessName || 'contact'}.vcf`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <button
//             onClick={generateVCard}
//             className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
//             style={{
//                 backgroundColor: 'var(--primary, #2563eb)',
//                 color: '#fff',
//                 border: 'none'
//             }}
//         >
//             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
//                 <circle cx="12" cy="7" r="4"></circle>
//                 <path d="M19 8v6"></path>
//                 <path d="M22 11h-6"></path>
//             </svg>
//             Save Contact
//         </button>
//     );
// }


"use client";

export default function SaveContactButton({ profile }) {
    if (!profile) return null;

    const generateVCard = () => {
        const vcard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `N:${profile.businessName || "Business"};;;;`,
            `FN:${profile.businessName || "Business"}`,
            `ORG:${profile.businessName || "Business"}`,
            profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
            profile.email ? `EMAIL:${profile.email}` : "",
            profile.website ? `URL:${profile.website}` : "",
            profile.address
                ? `ADR;TYPE=WORK:;;${profile.address};${profile.city || ""};${profile.state || ""};${profile.pincode || ""};India`
                : "",
            `NOTE:${profile.description || "Saved from Landmark Properties"}`,
            "END:VCARD"
        ]
            .filter(Boolean)
            .join("\n");

        const blob = new Blob([vcard], {
            type: "text/vcard;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);

        // ✅ IMPORTANT CHANGE
        // Redirect instead of forcing download
        window.location.href = url;

        // Cleanup
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={generateVCard}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
                style={{
                    backgroundColor: "var(--primary, #2563eb)",
                    color: "#fff",
                    border: "none"
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    <path d="M19 8v6" />
                    <path d="M22 11h-6" />
                </svg>
                Save Contact
            </button>

            {/* UX Hint */}
            <p style={{ fontSize: "12px", color: "#555" }}>
                Tap <b>Save Contact</b> and confirm once
            </p>
        </div>
    );
}

