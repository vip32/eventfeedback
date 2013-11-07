namespace EventFeedback.Domain
{
    public enum FeedbackQuestionType
    {
        Freetext = 0,
        FreetextSingleLine = 1,
        ThreeStarRate = 10,
        FiveStarRate = 11,
        TenStarRate = 12,
        YesNo = 20,
        Choice = 21
    }
}