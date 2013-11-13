//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.Entity;
//using System.Data.Entity.Infrastructure;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web.Http;
//using System.Web.Http.Description;
//using EventFeedback.Domain;

//namespace EventFeedback.Web.Api.Controllers.Admin
//{
//    public class TestController : ApiController
//    {
//        private DataContext db = new DataContext();

//        // GET api/Test
//        public IQueryable<User> GetIdentityUsers()
//        {
//            return db.IdentityUsers;
//        }

//        // GET api/Test/5
//        [ResponseType(typeof(User))]
//        public IHttpActionResult GetUser(string id)
//        {
//            User user = db.IdentityUsers.Find(id);
//            if (user == null)
//            {
//                return NotFound();
//            }

//            return Ok(user);
//        }

//        // PUT api/Test/5
//        public IHttpActionResult PutUser(string id, User user)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            if (id != user.Id)
//            {
//                return BadRequest();
//            }

//            db.Entry(user).State = EntityState.Modified;

//            try
//            {
//                db.SaveChanges();
//            }
//            catch (DbUpdateConcurrencyException)
//            {
//                if (!UserExists(id))
//                {
//                    return NotFound();
//                }
//                else
//                {
//                    throw;
//                }
//            }

//            return StatusCode(HttpStatusCode.NoContent);
//        }

//        // POST api/Test
//        [ResponseType(typeof(User))]
//        public IHttpActionResult PostUser(User user)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            db.IdentityUsers.Add(user);

//            try
//            {
//                db.SaveChanges();
//            }
//            catch (DbUpdateException)
//            {
//                if (UserExists(user.Id))
//                {
//                    return Conflict();
//                }
//                else
//                {
//                    throw;
//                }
//            }

//            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
//        }

//        // DELETE api/Test/5
//        [ResponseType(typeof(User))]
//        public IHttpActionResult DeleteUser(string id)
//        {
//            User user = db.IdentityUsers.Find(id);
//            if (user == null)
//            {
//                return NotFound();
//            }

//            db.IdentityUsers.Remove(user);
//            db.SaveChanges();

//            return Ok(user);
//        }

//        protected override void Dispose(bool disposing)
//        {
//            if (disposing)
//            {
//                db.Dispose();
//            }
//            base.Dispose(disposing);
//        }

//        private bool UserExists(string id)
//        {
//            return db.IdentityUsers.Count(e => e.Id == id) > 0;
//        }
//    }
//}