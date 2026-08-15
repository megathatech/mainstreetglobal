import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantImage, searchImages } from '@/lib/unsplash';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || 'restaurant food';
  const action = searchParams.get('action') || 'random';
  const perPage = parseInt(searchParams.get('perPage') || '10');

  try {
    if (action === 'search') {
      const images = await searchImages(query, perPage);
      return NextResponse.json({ success: true, images });
    } else {
      const image = await getRestaurantImage(query);
      return NextResponse.json({ success: true, image });
    }
  } catch (error) {
    console.error('Unsplash API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
