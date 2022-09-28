import React, { FC } from "react";
import { strikeTypes } from "../data/legs";
import { ILeg } from "../interfaces";

const Leg: FC<ILeg> = ({ leg, handleOnChangeEvenet, handleSubmitLeg }) => {
  return (
    <>
      <div className="leg__options">
        <div className="option">
          <label htmlFor="total lot">Total Lot</label>
          <br />
          <input
            type="number"
            name="total_lot"
            value={leg.total_lot}
            onChange={handleOnChangeEvenet}
          />
        </div>
        <div className="option">
          <label htmlFor="position">Position</label>
          <br />
          <select
            name="position"
            value={leg.position}
            //   defaultValue="Sell"
            onChange={handleOnChangeEvenet}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </div>
        <div className="option">
          <label htmlFor="option type">Option Type</label>
          <br />
          <select
            name="option_type"
            value={leg.option_type}
            //   defaultValue="Call"
            onChange={handleOnChangeEvenet}
          >
            <option value="Put">Put</option>
            <option value="Call">Call</option>
          </select>
        </div>
        <div className="option">
          <label htmlFor="expiry">Expiry</label>
          <br />
          <select
            name="expiry"
            value={leg.expiry}
            //   defaultValue="Weekly"
            onChange={handleOnChangeEvenet}
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
        <div className="option">
          <label htmlFor="strike criteria">Select Strike Criteria</label>
          <br />
          <select
            name="strike_criteria"
            value={leg.strike_criteria}
            defaultValue="Strike Type"
            onChange={handleOnChangeEvenet}
          >
            <option value="Strike Type">Strike Type</option>
            <option value="Premium Range">Premium Range</option>
            <option value="Closest Premium">Closest Premium</option>
            <option value="Straddle Width">Straddle Width</option>
          </select>
        </div>

        {/* Strike Type. Only show if strike criteria is === Strike Type */}
        {leg.strike_criteria === "Strike Type" && (
          <div className="option">
            <label htmlFor="strike type">Strike Type</label> <br />
            <select
              name="strike_type"
              value={leg.strike_type}
              onChange={handleOnChangeEvenet}
            >
              {strikeTypes.map((strike, idx: number) => (
                <option value={strike} key={idx}>
                  {strike}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Strike Ranges. Only visible if strike criteria === Premium Range */}
        {leg.strike_criteria === "Premium Range" && (
          <div className="option">
            <label htmlFor="lower range">Lower Range</label> <br />
            <input
              type="number"
              name="lower_range"
              value={leg.lower_range}
              onChange={handleOnChangeEvenet}
            />
          </div>
        )}
        {leg.strike_criteria === "Premium Range" && (
          <div className="option">
            <label htmlFor="upper range">Upper Range</label> <br />
            <input
              type="number"
              name="upper_range"
              value={leg.upper_range}
              onChange={handleOnChangeEvenet}
            />
          </div>
        )}

        {/* Premium. Only visible if strike criteria === Closest Premium */}
        {leg.strike_criteria === "Closest Premium" && (
          <div className="option">
            <label htmlFor="premium">Premium</label> <br />
            <input
              type="number"
              name="premium"
              value={leg.premium}
              onChange={handleOnChangeEvenet}
            />
          </div>
        )}

        {/* ATM Strike */}
        {leg.strike_criteria === "Straddle Width" && (
          <div className="option">
            [ATM Strike{" "}
            <select
              name="atm_strike_sign"
              value={leg.atm_strike_sign}
              onChange={handleOnChangeEvenet}
              defaultValue="-"
            >
              <option value="-">-</option>
              <option value="+">+</option>
            </select>
            (
            <input
              type="number"
              name="atm_strike_amount"
              value={leg.atm_strike_amount}
              onChange={handleOnChangeEvenet}
            />{" "}
            x ATM Saddle Price) ]
          </div>
        )}
      </div>

      {/* Leg Action Buttons */}
      <div className="action__buttons">
        <button className="add__leg" onClick={handleSubmitLeg}>
          Add Leg
        </button>
        <button className="cancel">Cancel</button>
      </div>
    </>
  );
};

export default Leg;
