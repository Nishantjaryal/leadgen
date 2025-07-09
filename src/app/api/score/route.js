import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { leads } = await request.json();

        if (!Array.isArray(leads)) {
            return NextResponse.json({ error: 'Invalid leads data' }, { status: 400 });
        }

        const scoredLeads = leads.map(lead => {
            let score = 0;
            const title = lead.title?.toLowerCase() || '';

            if (title.includes('ceo') || title.includes('founder') || title.includes('president')) {
                score += 10;
            } else if (title.includes('head') || title.includes('director') || title.includes('vp') || title.includes('vice president')) {
                score += 8;
            } else if (title.includes('sales') || title.includes('business development') || title.includes('account')) {
                score += 5;
            } else if (title.includes('intern') || title.includes('assistant') || title.includes('junior')) {
                score += -5;
            } else {
                score += 2;
            }

            // Return the lead with its calculated score
            return {
                ...lead,
                score: score
            };
        });

        return NextResponse.json({ leads: scoredLeads });
    } catch (error) {
        console.error('Error scoring leads:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}