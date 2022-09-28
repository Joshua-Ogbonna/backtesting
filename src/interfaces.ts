import { StrikeCriteria } from "./types";

export interface LegI {
    id: string
    PositionType: string,
    Lots: number,
    LegStopLoss: {
        Type: string,
        Value: number,
    },
    LegTarget: {
        Type: string,
        Value: number,
    },
    LegTrailSL: {
        Type: string,
        Value: {
            InstrumentMove: number,
            StopLossMove: number,
        },
    },
    LegMomentum: {
        Type: string,
        Value: number,
    },
    ExpiryKind: string,
    EntryType: string,
    StrikeParameter: any,
    InstrumentKind: string,
    LegReentrySL: {
        Type: string,
        Value: number,
    },
    LegReentryTP: {
        Type: string,
        Value: number,
    }
}



export interface TLeg {
    id: string
    total_lot: number;
    position: string;
    option_type: string;
    expiry: string;
    strike_criteria: StrikeCriteria;
    strike_type: "";
    lower_range: number;
    upper_range: number;
    premium: number;
    atm_strike_sign: string;
    atm_strike_amount: number;
    leg_stop_loss: {
        type: string,
        value: number
    }
    leg_target: {
        type: string,
        value: number
    }
    leg_trail_sl: {
        type: string,
        value: {
            instrument_move: number,
            stop_lost_move: number
        }
    }
    leg_momentum: {
        type: string,
        value: number
    }
    instrument_kind: string
    leg_rentry_sl: {
        type: string,
        value: number
    }
    leg_rentry_tp: {
        type: string,
        value: number
    }
}

export interface ILeg {
    leg: TLeg;
    handleOnChangeEvenet: React.ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement
    >;
    handleSubmitLeg: () => void
}