interface VoteButtonProps {
  handleVoteSubmit: (e: React.FormEvent) => void;
}

const VoteButton = ({ handleVoteSubmit }: VoteButtonProps) => {
  return (
    <div className="flex justify-center mt-14">
      <button
        className="bg-[#838380] text-white hover:bg-buttonA hover:text-textButton tracking-[0.30em] w-full text-lg font-semibold py-[10px] px-16 rounded-lg focus:outline-none focus:shadow-outline shadow-lg"
        onClick={handleVoteSubmit}
      >
        선택 완료
      </button>
    </div>
  );
};

export default VoteButton;
