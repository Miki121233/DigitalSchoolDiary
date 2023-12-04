using System;
namespace API.Dtos;

public class MessageDto
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string SenderFullName { get; set; }
    public string SenderAccountType { get; set; }
    public int RecipientId { get; set; }
    public string RecipientFullName { get; set; }
    public string RecipientAccountType { get; set; }
    public string Content { get; set; }
    public DateTime? DateRead { get; set; }
    public DateTime MessageSent { get; set; }
}