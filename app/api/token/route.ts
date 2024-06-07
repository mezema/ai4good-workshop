import { NextRequest, NextResponse } from 'next/server';
import { generateRandomAlphanumeric } from '@/lib/util';
import { AccessToken } from 'livekit-server-sdk';
import type { AccessTokenOptions, VideoGrant } from 'livekit-server-sdk';
import { TokenResult } from '@/lib/types';

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

const createToken = (userInfo: AccessTokenOptions, grant: VideoGrant) => {
  const at = new AccessToken(apiKey, apiSecret, userInfo);
  at.addGrant(grant);
  return at.toJwt();
};

export async function GET(request: Request) {
  try {
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Environment variables aren't set up correctly" },
        { status: 500 }
      );
    }

    const roomName = `room-${generateRandomAlphanumeric(4)}-${generateRandomAlphanumeric(4)}`;
    const identity = `identity-${generateRandomAlphanumeric(4)}`;

    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    };

    const token = await createToken({ identity }, grant);
    const result: TokenResult = {
      identity,
      accessToken: token,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: (e as Error).message },
      { status: 500 }
    );
  }
}