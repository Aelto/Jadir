SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `answers_comment` int(11) DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `date` date NOT NULL,
  `author_id` int(11) NOT NULL,
  `content` text,
  `tags` text NOT NULL,
  `author` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `posts` (`id`, `title`, `date`, `author_id`, `content`, `tags`, `author`) VALUES
(1, 'Welcome to Jadir !', '2017-09-21', 1, 'Well, what can i say but "WELCOME !" ?', '#welcome', 'Aeltoth');


CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `password` text NOT NULL,
  `role` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `users` (`id`, `name`, `password`, `role`) VALUES
(1, 'Aeltoth', 'password', 1);



ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);



ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
