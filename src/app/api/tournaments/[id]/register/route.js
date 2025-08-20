// src/app/api/tournaments/[tournamentId]/register/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Tournament from "@/models/Tournament";
import TournamentGame from "@/models/TournamentGame";
import GameRegistration from "@/models/GameRegistration";
import { authMiddleware } from "@/lib/auth"; // middleware that injects req.user

export const POST = authMiddleware(async (req, { params }) => {
  const { tournamentId } = params;
  const body = await req.json();
  const { tournamentGameIds, paymentMethod, paymentDetails } = body;
  const userId = req.user._id;

  if (!Array.isArray(tournamentGameIds) || tournamentGameIds.length === 0) {
    return NextResponse.json({ error: "No games selected" }, { status: 400 });
  }

  // validate tournament
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    return NextResponse.json(
      { error: "Tournament not found" },
      { status: 404 }
    );
  }

  // validate games
  const games = await TournamentGame.find({
    _id: { $in: tournamentGameIds },
    tournament: tournamentId,
  });

  if (games.length !== tournamentGameIds.length) {
    return NextResponse.json(
      { error: "Some games not found" },
      { status: 400 }
    );
  }

  // check duplicates
  const existing = await GameRegistration.find({
    tournament: tournamentId,
    tournamentGame: { $in: tournamentGameIds },
    user: userId,
  });

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Already registered in one or more selected games" },
      { status: 400 }
    );
  }

  // calculate total fee
  const totalFee = games.reduce((sum, g) => sum + (g.entryFee || 0), 0);

  // transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const registrations = await Promise.all(
      games.map((g) =>
        GameRegistration.create(
          [
            {
              tournament: tournamentId,
              tournamentGame: g._id,
              user: userId,
              entryFeeSnapshot: g.entryFee || 0,
              totalPaid: g.entryFee || 0, // change later if partial/manual
              paid: paymentMethod !== "manual" ? true : false,
              paymentMethod,
              paymentDetails,
            },
          ],
          { session }
        )
      )
    );

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "Registration successful",
        totalFee,
        registrations: registrations.flat(),
      },
      { status: 201 }
    );
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});
