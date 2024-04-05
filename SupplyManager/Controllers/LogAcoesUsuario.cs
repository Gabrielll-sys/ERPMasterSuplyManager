using Microsoft.AspNetCore.Mvc;
using SupplyManager.Services;

namespace SupplyManager.Controllers;

public class LogAcoesUsuario:ControllerBase
{
    private readonly ILogAcoesUsuarioService _logAcoesUsuarioService;


    public LogAcoesUsuario(ILogAcoesUsuarioService logAcoesUsuarioService)
    {
        _logAcoesUsuarioService = logAcoesUsuarioService;
    }
    
    
}