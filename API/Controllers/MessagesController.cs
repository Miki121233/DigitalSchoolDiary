using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Extensions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class MessagesController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public MessagesController(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Message>>> GetAllMessages()
    {
        return await _context.Messages.ToListAsync();        
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser(int userId, [FromQuery] string container)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user is null) return BadRequest("Błędne id użytkownika");

        var messages = _context.Messages
            .OrderByDescending(x => x.MessageSent)
            .AsQueryable();

        messages = container.ToString() switch
        {
            "Inbox" => messages.Where(u => u.RecipientId == userId),
            "Outbox" => messages.Where(u => u.SenderId == userId),
            //"Unread" below
            _ => messages.Where(u => u.RecipientId == userId && u.DateRead == null)
        };

        var messagesDto = messages.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

        return await messagesDto.ToListAsync();        
    }

    [HttpGet("{userId}/{recipientId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForThread(int userId, int recipientId)
    {
        if (userId == recipientId) return BadRequest("Nie można pisać z samym sobą");

        var messages = await _context.Messages
            .Include(x => x.Sender)
            .Include(x => x.Recipient)
            .Where(
                m => m.RecipientId == userId && m.SenderId == recipientId ||
                m.RecipientId == recipientId && m.SenderId == userId
            )
            .OrderBy(m => m.MessageSent)
            .ToListAsync();        

        var unreadMessages = messages.Where(m => m.DateRead == null && m.RecipientId == userId).ToList();
        
        if (unreadMessages.Any())
        {
            foreach (var message in unreadMessages)
            {
                message.DateRead = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }

        var messagesDto = _mapper.Map<IEnumerable<MessageDto>>(messages);

        return messagesDto.ToList();
    }

    [HttpPost("{senderId}/{recipientId}")]
    public async Task<ActionResult<MessageDto>> PostMessage(int senderId, int recipientId, MessageContent messageContent)
    {
        if (messageContent is null) return BadRequest("Wiadomość nie może być pusta");
        if (senderId == recipientId) return BadRequest("Nie można wysłać wiadomości do siebie samego");

        var sender = await _context.Users.FindAsync(senderId);
        if (sender is null) return BadRequest("Błędne id wysyłającego");
        var recipient = await _context.Users.FindAsync(recipientId);
        if (recipient is null) return BadRequest("Błędne id odbierającego");

        var message = new Message
        {
            SenderId = senderId,
            SenderFullName = sender.LastName + " " + sender.FirstName,
            Sender = sender,
            RecipientId = recipientId,
            RecipientFullName = recipient.LastName + " " + recipient.FirstName,
            Recipient = recipient,
            Content = messageContent.Content
        };

        await _context.AddAsync(message);
        await _context.SaveChangesAsync();

        var messageDto = _mapper.Map<MessageDto>(message);

        return messageDto;        
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var userId = User.GetUserId();
        if(await _context.Teachers.FindAsync(userId) is null) return Unauthorized("Tylko nauczyciele mogą usuwać wiadomości");

        var message = await _context.Messages.FindAsync(id);

        if (message.SenderId != userId && message.RecipientId != userId) 
            return Unauthorized();

        _context.Remove(message);
        await _context.SaveChangesAsync();

        return Ok();
    }

}