import React from "react";
import SingleLeg from "./SingleLeg";

const Legs = ({
  allLegs,
  copyLeg,
  deleteLeg
}: {
  allLegs: [];
  copyLeg: (id: string) => void;
  deleteLeg: (id: string) => void
}) => {
  // const [allLegs, setAllLegs] = useState(legs);

  // const handleDeleteLeg = (id: string) => {
  //   const filteredLegs = allLegs.filter((leg) => leg.id !== id);
  //   setAllLegs(filteredLegs);
  //   console.log(filteredLegs);
  // };

  // const handleAddLeg = (id: string) => {
  //   const foundLeg = allLegs.filter((leg) => leg.id === id);
  //   console.log(foundLeg[0]);
  //   setAllLegs((result) => [...result, { ...foundLeg[0], id: v4() }]);
  // };

  const handleSubmitLegs = () => {
    console.log(allLegs);
  };

  return (
    <div className="all__legs">
      {allLegs.length > 0 &&
        allLegs.map((leg: any) => (
          <SingleLeg
            leg={leg}
            key={leg.id}
            handleDeleteLeg={deleteLeg}
            handleAddLeg={copyLeg}
          />
        ))}
      {allLegs.length > 0 && (
        <div className="submit__action">
          <button onClick={handleSubmitLegs}>Submit Legs</button>
        </div>
      )}
    </div>
  );
};

export default Legs;
