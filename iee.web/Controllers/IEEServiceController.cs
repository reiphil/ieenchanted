using iee.domain;
using iee.domain.BinderModels;
using iee.domain.Models;
using ieenchanted.ControllerModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ieenchanted.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IEEServiceController : ControllerBase
    {
        private IEEDBService _dbService;
        private readonly IConfiguration _configuration;

        public IEEServiceController(IConfiguration configuration, IEEDBService dbService)
        {
            _dbService = dbService;
            _configuration = configuration;
        }

        [HttpGet("GetStoreInfo")]
        public async Task<IActionResult> GetStoreInfo(int storeId)
        {
            return Ok(new
            {
                storeInfo = await _dbService.GetStoreInfo(storeId)
            });
        }

        [HttpGet("DeleteEvent")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(int eventId)
        {
            return Ok(new
            {
                message = await _dbService.DeleteEvent(eventId)
            });
        }

        [HttpGet("DeleteStore")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStore(int storeId)
        {
            return Ok(new
            {
                message = await _dbService.DeleteStore(storeId)
            });
        }

        [HttpPost("UpdateStoreInfo")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStoreInfo([FromBody] FullStoreModel storeModel)
        {
            return Ok(new { storeId = await _dbService.SaveStoreInfo(storeModel) });
        }

        [HttpGet("GetStores")]
        public async Task<IActionResult> GetStores()
        {
            return Ok(new
            {
                data = await _dbService.GetStores()
            });
        }

        [HttpGet("GetLiveEvents")]
        public async Task<IActionResult> GetLiveEvents()
        {
            return Ok(new
            {
                data = await _dbService.GetAllLiveEvents()
            });
        }

        [HttpGet("GetWeeklyEvents")]
        public async Task<IActionResult> GetWeeklyEvents()
        {
            return Ok(new
            {
                data = await _dbService.GetAllWeeklyEvents()
            });
        }

        [HttpGet("GetAllEvents")]
        public async Task<IActionResult> GetAllEvents()
        {
            return Ok(new
            {
                data = await _dbService.GetAllEvents()
            });
        }

        [HttpGet("GetEventInfo")]
        public async Task<IActionResult> GetEventInfo(int eventId)
        {
            return Ok(new
            {
                data = await _dbService.GetEventInfo(eventId)
            });
        }

        [HttpPost("UpdateEventInfo")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEventInfo([FromBody] EventInfoBinder eventInfo)
        {
            return Ok(new { eventId = await _dbService.SaveEventInfo(eventInfo.ReturnEventInfo()) });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserModel model)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(model.password);

            try
            {
                await _dbService.SaveUser(model.username, passwordHash);
                return Ok("User created, please login!");
            }
            catch (Exception Ex)
            {
                return BadRequest(Ex.Message);
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginUser([FromBody] UserModel model)
        {
            var user = await _dbService.GetUser(model.username);

            if (user != null && BCrypt.Net.BCrypt.Verify(model.password, user.PasswordHash))
            {
                var token = GenerateJwtToken(user);
                Console.WriteLine($"Generated JWT: {token}");
                Response.Cookies.Append("iee_auth_token", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.Now.AddDays(5)
                });
                return Ok("Logged In");
            }
            else return Unauthorized("Invalid Username/Password");
        }

        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            Response.Cookies.Append("iee_auth_token", "", new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(-1), // Set expiry in the past
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("auth/status")]
        public IActionResult CheckAuthStatus()
        {
            var userClaims = User?.Identity?.IsAuthenticated == true ? User : null;
            if (userClaims == null)
                return Ok(new { isAuthenticated = false });

            return Ok(new
            {
                isAuthenticated = true,
                user = new
                {
                    Username = userClaims.Identity.Name,
                    Roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value)
                }
            });
        }

        [HttpGet("GetStoresAndEvents")]
        public async Task<IActionResult> GetStoresAndEvents()
        {
            try
            {
                return Ok(new
                {
                    events = await _dbService.GetAllEvents(),
                    stores = await _dbService.GetStores(),
                });
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetAllJudges")]
        public async Task<IActionResult> GetAllJudges()
        {
            try
            {
                return Ok(new
                {
                    judges = await _dbService.GetAllJudges(),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.IsSuperAdmin ? "Admin": "User")
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(5),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
